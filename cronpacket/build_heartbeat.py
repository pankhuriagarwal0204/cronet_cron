from cronet.cronpack import CronPack
import struct
import sys, json

def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    obj = CronPack()
    packet = None
    #val = read_in()

    try:
        packet = obj.build("cronpack", source_addr=23, dest_addr=45,
                           packet_type=obj.PACKET_TYPES['REMOTE_TO_GATEWAT_HEARTBEAT_RESPONSE'])
    except Exception as e:
        print e

    print packet

if __name__== "__main__":
    main()