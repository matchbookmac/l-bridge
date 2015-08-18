Scan ports:
```console
nc -z -u -v -n 172.20.2.221 1-1024 >> ~/dump.txt
```

`nc` is netcat. See:
http://mylinuxbook.com/linux-netcat-command/
for usage.

According to:
http://control.com/thread/1330712828
ports 2222 and 44818 result in:

```console
nc -u -v 172.20.2.221 2222
found 0 associations
found 1 connections:
     1:	flags=82<CONNECTED,PREFERRED>
	outif (null)
	src 172.20.150.158 port 62472
	dst 172.20.2.221 port 2222
	rank info not available

Connection to 172.20.2.221 port 2222 [udp/rockwell-csp2] succeeded!
```
```console
nc -u -v 172.20.2.221 44818
found 0 associations
found 1 connections:
     1:	flags=82<CONNECTED,PREFERRED>
	outif (null)
	src 172.20.150.158 port 63711
	dst 172.20.2.221 port 44818
	rank info not available

Connection to 172.20.2.221 port 44818 [udp/rockwell-encap] succeeded!
```
See:
http://literature.rockwellautomation.com/idc/groups/literature/documents/qr/comm-qr001_-en-e.pdf
for port descriptions
