from cronet.cronpack import CronPack
import struct
import sys, json

def myunpack(data):
    print "packet_type",struct.unpack("<h",data['packet_type'])
    print "dest_addr",struct.unpack("<h",data['dest_addr'])
    print "source_addr",struct.unpack("<h",data['source_addr'])
    print "payload", data['payload']

def main():
    obj = CronPack()
    val = sys.argv[1]
    data = val.decode("hex")

    try:
        a = obj.parse("cronpack", data)
        myunpack(a)
    except Exception as e:
        print e

if __name__== "__main__":
    main()