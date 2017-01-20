from cronet.builder import Builder
import struct

class CronPack(Builder):
    CRONET_HEADER = b'\xFF\xFF\xFD'
    PROTOCOL_VERSION = b'\x01'
    PAYLOAD_LENGTH_BYTES = 2
    MIN_PACK_LENGTH = len(CRONET_HEADER) + len(PROTOCOL_VERSION) + 2  # 3 bytes header + 2 bytes protocol version + 2 bytes length of payload

    PACKET_TYPES = {
        'CRONET_PACKET_RECEIVE_ACQ': 1,
        'CORE_API_TO_GATEWAY_HEARTBEAT_REQUEST': 101,
        'GATEWAY_TO_CORE_API_HEARTBEAT_RESPONSE': 102,
        'REMOTE_TO_BASE_HEARTBEAT_REQUEST': 103,
        'BASE_TO_REMOTE_HEARTBEAT_RESPONSE': 104,
        'GATEWAY_TO_REMOTE_HEARTBEAT_REQUEST': 105,
        'REMOTE_TO_GATEWAT_HEARTBEAT_RESPONSE': 106,
        'GATEWAY_TO_SPARTAN_HEARTBEAT_REQUEST': 107,
        'SPARTAN_TO_GATEWAT_HEARTBEAT_RESPONSE': 108,
        'GATEWAY_TO_SKYWATCH_HEARTBEAT_REQUEST': 109,
        'SKYWATCH_TO_GATEWAY_HEARTBEAT_RESPONSE': 110,
        'BASE_TO_REMOTE_INTRUSION_DETECTED_RUNNING': 201,
        'BASE_TO_REMOTE_INTRUSION_DETECTED_JUMPING': 201,
        'BASE_TO_REMOTE_INTRUSION_DETECTED_CRAWLING': 201,
        'BASE_TO_REMOTE_INTRUSION_DETECTED_FALSE_ALARM': 201,
        'REMOTE_TO_GATEWAY_INTRUSION_DETECTED_RUNNING': 202,
        'REMOTE_TO_GATEWAY_INTRUSION_DETECTED_JUMPING': 202,
        'REMOTE_TO_GATEWAY_INTRUSION_DETECTED_CRAWLING': 202,
        'REMOTE_TO_GATEWAY_INTRUSION_DETECTED_FALSE_ALARM': 202,
        'GATEWAY_TO_CORE_API_INTRUSION_DETECTED_RUNNING': 203,
        'GATEWAY_TO_CORE_API_INTRUSION_DETECTED_JUMPING': 203,
        'GATEWAY_TO_CORE_API_INTRUSION_DETECTED_CRAWLING': 203,
        'GATEWAY_TO_CORE_API_INTRUSION_DETECTED_FALSE_ALARM': 203,
        'REMOTE_TO_BASE_INTRUSION_ACKNOWLEDGED_INDICATOR': 204,
        'BASE_FAILURE_DETECTED_AT_REMOTE_TO_GATEWAY': 301,
        'BASE_FAILURE_NOTIFICATION_FROM_GATEWAY_TO_CORE_API': 302,
        'SENSOR_FAILURE_DETECTED_BY_BASE_TO_REMOTE': 303,
        'SENSOR_FAILURE_NOTIFICATION_FROM_REMOTE_TO_GATEWAY': 304,
        'SENSOR_FAILURE_NOTIFICATION_FROM_GATEWAY_TO_CORE_API': 305,
    }

    packets ={
        "cronpack":
            [
                {'name': 'source_addr', 'len':2, 'default': None, 'pack': '<h'},
                {'name': 'dest_addr', 'len': 2, 'default': None, 'pack': '<h'},
                {'name': 'packet_type', 'len': 2, 'default': None, 'pack': '<h', "check": lambda self, data: self.check_packet_type(data)},
                {'name': 'sync_cmd', 'len': 1, 'default': b'\x01'},
                {'name': 'payload', 'len': None, 'default': None},
            ],
    }

    def check_packet_type(self, data):
        if not isinstance(data, int):
            data = struct.unpack('<h',data)[0]

        if data in self.PACKET_TYPES.values():
            return
        raise Exception("Cronet Invalid packet type.")

    def __init__(self):
        super(CronPack, self).__init__()
