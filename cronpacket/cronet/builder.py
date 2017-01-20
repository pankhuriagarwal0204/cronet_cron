import struct
from cronet.converter import byteToInt, intToByte


class Builder(object):
    def __init__(self):
        pass

    def build(self, name, **kwargs):
        try:
            packet_spec = self.packets[name]
        except KeyError:
            raise NotImplementedError("Packet specifications could not be found for (%s)." % name)

        packet = b''

        for field in packet_spec:
            try:
                # Read this field's name from the function arguments dict
                data = kwargs[field['name']]
                self.check_for_function(data, field)
                data = self.check_and_pack(data, field)

            except KeyError:
                # Data wasn't given
                # Only a problem if the field has a specific length
                if field['len'] is not None:
                    # Was a default value specified?
                    default_value = field['default']
                    if default_value:
                        # If so, use it
                        data = default_value
                    else:
                        # Otherwise, fail
                        raise KeyError(
                            "The expected field %s of length %d was not provided"
                            % (field['name'], field['len']))
                else:
                    # No specific length, ignore it
                    data = None

            # Ensure that the proper number of elements will be written
            if field['len'] and len(data) != field['len']:
                raise ValueError(
                    "The data provided for '%s' was not %d bytes long" \
                    % (field['name'], field['len']))

            # Add the data to the packet, if it has been specified
            # Otherwise, the parameter was of variable length, and not
            #  given
            if data:
                packet += data

        packet = self.CRONET_HEADER + self.PROTOCOL_VERSION + self.len_bytes(packet) + packet

        return packet

    def len_bytes(self, packet):
        count = len(packet)
        return struct.pack("<h", count)

    def check_and_pack(self, data, field):
        try:
            if field['pack']:
                if not isinstance(data, str):
                    return struct.pack(field['pack'], data)
                return data
        except KeyError:
            return data

    def check_and_unpack(self, data, field):
        try:
            if field['pack']:
                return struct.unpack(field['pack'], data)[0]
        except KeyError:
            return data

    def convert(self, packet):
        packtemp = b''
        for i in packet:
            packtemp += intToByte(byteToInt(i))
        return packtemp

    def check_for_function(self, data, field):
        try:
            if field['check']:
                try:
                    field['check'](self, data)
                except Exception as e:
                    raise ValueError(e)
        except KeyError:
            pass

    def parse(self, name, packet):
        data = {}
        packet = self.convert(packet)
        if len(packet) < self.MIN_PACK_LENGTH:
            raise ValueError(
                "Cronet Packet was shorter than expected; minimum expected: %d, got: %d bytes" % (
                self.MIN_PACK_LENGTH, len(packet)))

        header_length = len(self.CRONET_HEADER)

        if packet[0:header_length] != self.CRONET_HEADER:
            raise ValueError("Cronet Header is not matched.got %s expected" %packet[0:header_length] )

        protocol_length = len(self.PROTOCOL_VERSION)

        if packet[header_length] != self.PROTOCOL_VERSION:
            raise ValueError("Cronet Protocol Version is not matched.")

        packet_len = struct.unpack("<h", packet[header_length+protocol_length:self.MIN_PACK_LENGTH])[0]

        if packet_len != len(packet[self.MIN_PACK_LENGTH:]):
            raise ValueError("Cronet Packet length is not matched.")

        try:
            packet_spec = self.packets[name]
        except KeyError:
            raise NotImplementedError("Cronet Packet specifications could not be found for (%s)." % name)

        index = self.MIN_PACK_LENGTH

        for field in packet_spec:
            # Read this field's name from the function arguments dict
            if field['len'] is not None:
                if len(packet[index:]) < field['len']:
                    raise ValueError("Cronet Packet was shorter than expected.")
                # enable for auto unpack
                # data[field['name']] = self.check_and_unpack(packet[index:index + field['len']], field)
                data[field['name']] = packet[index:index + field['len']]
                self.check_for_function(data[field['name']], field)
                index += field['len']
            else:
                    data[field['name']] = packet[index:]
        return data
