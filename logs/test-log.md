**info:** Bound to 0.0.0.0:161 15:44:15 | listener.js:39
**info:** [N/A] outgoing post /bridges/events/actual - 200 15:44:16 | post-bridge-message.js:31
**info:** [N/A] outgoing post /bridges/events/actual - 400 15:44:16 | post-bridge-message.js:31
**trace:** { raw: 
   { buf: <Buffer 30 2d 02 01 00 04 06 70 75 62 6c 69 63 a0 20 02 01 01 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 06 05 00>,
     len: 47 },
  origin: { family: 'udp4', address: '172.20.165.57', port: 51753 },
  snmpmsg: 
   SnmpMessage {
     _version: 
      SnmpInteger {
        _value: 0,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter],
        _tag: 2 },
     _community: 
      SnmpOctetString {
        _value: <Buffer 70 75 62 6c 69 63>,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter],
        _tag: 4 },
     _src: { family: 'udp4', address: '172.20.165.57', port: 51753 },
     _raw: 
      { buf: <Buffer 30 2d 02 01 00 04 06 70 75 62 6c 69 63 a0 20 02 01 01 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 06 05 00>,
        len: 47 },
     version: [Getter],
     community: [Getter],
     raw: [Getter],
     src: [Getter],
     pdu: [Getter/Setter],
     _pdu: 
      SnmpStdPDU {
        _op: 0,
        _varbinds: [Object],
        op: [Getter],
        varbinds: [Getter/Setter],
        _request_id: [Object],
        _error_status: [Object],
        _error_index: [Object],
        request_id: [Getter],
        error_status: [Getter/Setter],
        error_index: [Getter/Setter] },
     _conn_recv: 
      Socket {
        domain: null,
        _events: [Object],
        _eventsCount: 2,
        _maxListeners: undefined,
        _handle: [Object],
        _receiving: true,
        _bindState: 2,
        type: 'udp4',
        fd: -42,
        _reuseAddr: undefined } } } 'Received SNMP message' 15:44:16 | receiver.js:54
**trace:** { raw: 
   { buf: <Buffer 30 2d 02 01 00 04 06 70 75 62 6c 69 63 a2 20 02 01 01 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 06 81 00>,
     len: 47 },
  dst: { family: 'udp4', address: '172.20.165.57', port: 51753 },
  snmpmsg: 
   SnmpMessage {
     _version: 
      SnmpInteger {
        _value: 0,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter] },
     _community: 
      SnmpOctetString {
        _value: <Buffer 70 75 62 6c 69 63>,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter] },
     _src: undefined,
     _raw: 
      { buf: <Buffer 30 2d 02 01 00 04 06 70 75 62 6c 69 63 a2 20 02 01 01 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 06 81 00>,
        len: 47 },
     version: [Getter],
     community: [Getter],
     raw: [Getter],
     src: [Getter],
     pdu: [Getter/Setter],
     dst: { family: 'udp4', address: '172.20.165.57', port: 51753 },
     _pdu: 
      SnmpStdPDU {
        _op: 2,
        _varbinds: [Object],
        op: [Getter],
        varbinds: [Getter/Setter],
        _request_id: [Object],
        _error_status: [Object],
        _error_index: [Object],
        request_id: [Getter],
        error_status: [Getter/Setter],
        error_index: [Getter/Setter] } } } 'Sending SNMP response message' 15:44:16 | agent.js:159
**info:** [N/A] outgoing post /bridges/events/actual - 200 15:44:16 | post-bridge-message.js:31
**info:** Retry for:
{ bridge: 'bailey\'s bridge',
  status: true,
  timeStamp: 'Fri Sep 18 2015 15:44:16 GMT-0700 (PDT)' }
successful 15:44:16 | handle-post-response.js:93
**info:** [N/A] outgoing post /bridges/events/actual - 400 15:44:16 | post-bridge-message.js:31
**trace:** { raw: 
   { buf: <Buffer 30 2d 02 01 00 04 06 70 75 62 6c 69 63 a0 20 02 01 02 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 06 05 00>,
     len: 47 },
  origin: { family: 'udp4', address: '172.20.165.57', port: 58603 },
  snmpmsg: 
   SnmpMessage {
     _version: 
      SnmpInteger {
        _value: 0,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter],
        _tag: 2 },
     _community: 
      SnmpOctetString {
        _value: <Buffer 70 75 62 6c 69 63>,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter],
        _tag: 4 },
     _src: { family: 'udp4', address: '172.20.165.57', port: 58603 },
     _raw: 
      { buf: <Buffer 30 2d 02 01 00 04 06 70 75 62 6c 69 63 a0 20 02 01 02 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 06 05 00>,
        len: 47 },
     version: [Getter],
     community: [Getter],
     raw: [Getter],
     src: [Getter],
     pdu: [Getter/Setter],
     _pdu: 
      SnmpStdPDU {
        _op: 0,
        _varbinds: [Object],
        op: [Getter],
        varbinds: [Getter/Setter],
        _request_id: [Object],
        _error_status: [Object],
        _error_index: [Object],
        request_id: [Getter],
        error_status: [Getter/Setter],
        error_index: [Getter/Setter] },
     _conn_recv: 
      Socket {
        domain: null,
        _events: [Object],
        _eventsCount: 2,
        _maxListeners: undefined,
        _handle: [Object],
        _receiving: true,
        _bindState: 2,
        type: 'udp4',
        fd: -42,
        _reuseAddr: undefined } } } 'Received SNMP message' 15:44:16 | receiver.js:54
**trace:** { raw: 
   { buf: <Buffer 30 2d 02 01 00 04 06 70 75 62 6c 69 63 a2 20 02 01 02 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 06 81 00>,
     len: 47 },
  dst: { family: 'udp4', address: '172.20.165.57', port: 58603 },
  snmpmsg: 
   SnmpMessage {
     _version: 
      SnmpInteger {
        _value: 0,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter] },
     _community: 
      SnmpOctetString {
        _value: <Buffer 70 75 62 6c 69 63>,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter] },
     _src: undefined,
     _raw: 
      { buf: <Buffer 30 2d 02 01 00 04 06 70 75 62 6c 69 63 a2 20 02 01 02 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 06 81 00>,
        len: 47 },
     version: [Getter],
     community: [Getter],
     raw: [Getter],
     src: [Getter],
     pdu: [Getter/Setter],
     dst: { family: 'udp4', address: '172.20.165.57', port: 58603 },
     _pdu: 
      SnmpStdPDU {
        _op: 2,
        _varbinds: [Object],
        op: [Getter],
        varbinds: [Getter/Setter],
        _request_id: [Object],
        _error_status: [Object],
        _error_index: [Object],
        request_id: [Getter],
        error_status: [Getter/Setter],
        error_index: [Getter/Setter] } } } 'Sending SNMP response message' 15:44:16 | agent.js:159
**info:** [N/A] outgoing post /bridges/events/actual - 200 15:44:16 | post-bridge-message.js:31
**info:** Retry for:
{ bridge: 'bailey\'s bridge',
  status: true,
  timeStamp: 'Fri Sep 18 2015 15:44:16 GMT-0700 (PDT)' }
successful 15:44:16 | handle-post-response.js:93
**info:** [N/A] outgoing post /incoming - 404 15:44:16 | post-bridge-message.js:31
**info:** [N/A] outgoing post /bridges/events/actual - 200 15:44:16 | post-bridge-message.js:31
**info:** Retry for:
{ bridge: 'bailey\'s bridge',
  status: true,
  timeStamp: 'Fri Sep 18 2015 15:44:15 GMT-0700 (PDT)' }
successful 15:44:16 | handle-post-response.js:93
**info:** [N/A] outgoing post /500-error - 500 15:44:16 | post-bridge-message.js:31
**info:** [N/A] outgoing post /bridges/events/actual - 200 15:44:16 | post-bridge-message.js:31
**info:** Retry for:
{ bridge: 'bailey\'s bridge',
  status: true,
  timeStamp: 'Fri Sep 18 2015 15:44:15 GMT-0700 (PDT)' }
successful 15:44:16 | handle-post-response.js:65
**info:** [N/A] outgoing post /500-error - 500 15:44:16 | post-bridge-message.js:31
**info:** [N/A] outgoing post /bridges/events/actual - 400 15:44:16 | post-bridge-message.js:31
**trace:** { raw: 
   { buf: <Buffer 30 2d 02 01 00 04 06 70 75 62 6c 69 63 a0 20 02 01 03 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 06 05 00>,
     len: 47 },
  origin: { family: 'udp4', address: '172.20.165.57', port: 52396 },
  snmpmsg: 
   SnmpMessage {
     _version: 
      SnmpInteger {
        _value: 0,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter],
        _tag: 2 },
     _community: 
      SnmpOctetString {
        _value: <Buffer 70 75 62 6c 69 63>,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter],
        _tag: 4 },
     _src: { family: 'udp4', address: '172.20.165.57', port: 52396 },
     _raw: 
      { buf: <Buffer 30 2d 02 01 00 04 06 70 75 62 6c 69 63 a0 20 02 01 03 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 06 05 00>,
        len: 47 },
     version: [Getter],
     community: [Getter],
     raw: [Getter],
     src: [Getter],
     pdu: [Getter/Setter],
     _pdu: 
      SnmpStdPDU {
        _op: 0,
        _varbinds: [Object],
        op: [Getter],
        varbinds: [Getter/Setter],
        _request_id: [Object],
        _error_status: [Object],
        _error_index: [Object],
        request_id: [Getter],
        error_status: [Getter/Setter],
        error_index: [Getter/Setter] },
     _conn_recv: 
      Socket {
        domain: null,
        _events: [Object],
        _eventsCount: 2,
        _maxListeners: undefined,
        _handle: [Object],
        _receiving: true,
        _bindState: 2,
        type: 'udp4',
        fd: -42,
        _reuseAddr: undefined } } } 'Received SNMP message' 15:44:16 | receiver.js:54
**trace:** { raw: 
   { buf: <Buffer 30 2d 02 01 00 04 06 70 75 62 6c 69 63 a2 20 02 01 03 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 06 81 00>,
     len: 47 },
  dst: { family: 'udp4', address: '172.20.165.57', port: 52396 },
  snmpmsg: 
   SnmpMessage {
     _version: 
      SnmpInteger {
        _value: 0,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter] },
     _community: 
      SnmpOctetString {
        _value: <Buffer 70 75 62 6c 69 63>,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter] },
     _src: undefined,
     _raw: 
      { buf: <Buffer 30 2d 02 01 00 04 06 70 75 62 6c 69 63 a2 20 02 01 03 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 06 81 00>,
        len: 47 },
     version: [Getter],
     community: [Getter],
     raw: [Getter],
     src: [Getter],
     pdu: [Getter/Setter],
     dst: { family: 'udp4', address: '172.20.165.57', port: 52396 },
     _pdu: 
      SnmpStdPDU {
        _op: 2,
        _varbinds: [Object],
        op: [Getter],
        varbinds: [Getter/Setter],
        _request_id: [Object],
        _error_status: [Object],
        _error_index: [Object],
        request_id: [Getter],
        error_status: [Getter/Setter],
        error_index: [Getter/Setter] } } } 'Sending SNMP response message' 15:44:16 | agent.js:159
**info:** [N/A] outgoing post /bridges/events/actual - 200 15:44:16 | post-bridge-message.js:31
**info:** Retry for:
{ bridge: 'bailey\'s bridge',
  status: true,
  timeStamp: 'Fri Sep 18 2015 15:44:16 GMT-0700 (PDT)' }
successful 15:44:16 | handle-post-response.js:93
**info:** [N/A] outgoing post /bridges/events/actual - 500 15:44:16 | post-bridge-message.js:31
**info:** [N/A] outgoing post /bridges/events/actual - 500 15:44:16 | post-bridge-message.js:31
**info:** [N/A] outgoing post /bridges/events/actual - 500 15:44:17 | post-bridge-message.js:31
**info:** [N/A] outgoing post /bridges/events/actual - 200 15:44:19 | post-bridge-message.js:31
**info:** Retry for:
{ bridge: 'bailey\'s bridge',
  status: true,
  timeStamp: 'Fri Sep 18 2015 15:44:15 GMT-0700 (PDT)' }
successful 15:44:19 | handle-post-response.js:65
**info:** [N/A] outgoing post /bridges/events/actual - 500 15:44:19 | post-bridge-message.js:31
**info:** [N/A] outgoing post /bridges/events/actual - 500 15:44:19 | post-bridge-message.js:31
**info:** [N/A] outgoing post /bridges/events/actual - 500 15:44:20 | post-bridge-message.js:31
**info:** [N/A] outgoing post /bridges/events/actual - 500 15:44:22 | post-bridge-message.js:31
**info:** [N/A] outgoing post /bridges/events/actual - 500 15:44:26 | post-bridge-message.js:31
**info:** [N/A] outgoing post /bridges/events/actual - 500 15:44:34 | post-bridge-message.js:31
**info:** [N/A] outgoing post /bridges/events/actual - 200 15:44:37 | post-bridge-message.js:31
**info:** Retry for:
{ bridge: 'bailey\'s bridge',
  status: true,
  timeStamp: 'Fri Sep 18 2015 15:44:15 GMT-0700 (PDT)' }
successful 15:44:37 | handle-post-response.js:65
**info:** Shutting down endpoint 0.0.0.0:161 15:44:53 | listener.js:52
**info:** Bound to 0.0.0.0:161 15:44:53 | listener.js:39
**trace:** { raw: 
   { buf: <Buffer 30 2a 02 01 00 04 03 61 6e 79 a0 20 02 01 04 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 05 05 00>,
     len: 44 },
  origin: { family: 'udp4', address: '172.20.165.57', port: 50688 },
  snmpmsg: 
   SnmpMessage {
     _version: 
      SnmpInteger {
        _value: 0,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter],
        _tag: 2 },
     _community: 
      SnmpOctetString {
        _value: <Buffer 61 6e 79>,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter],
        _tag: 4 },
     _src: { family: 'udp4', address: '172.20.165.57', port: 50688 },
     _raw: 
      { buf: <Buffer 30 2a 02 01 00 04 03 61 6e 79 a0 20 02 01 04 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 05 05 00>,
        len: 44 },
     version: [Getter],
     community: [Getter],
     raw: [Getter],
     src: [Getter],
     pdu: [Getter/Setter],
     _pdu: 
      SnmpStdPDU {
        _op: 0,
        _varbinds: [Object],
        op: [Getter],
        varbinds: [Getter/Setter],
        _request_id: [Object],
        _error_status: [Object],
        _error_index: [Object],
        request_id: [Getter],
        error_status: [Getter/Setter],
        error_index: [Getter/Setter] },
     _conn_recv: 
      Socket {
        domain: null,
        _events: [Object],
        _eventsCount: 2,
        _maxListeners: undefined,
        _handle: [Object],
        _receiving: true,
        _bindState: 2,
        type: 'udp4',
        fd: -42,
        _reuseAddr: undefined } } } 'Received SNMP message' 15:44:53 | receiver.js:54
**trace:** { raw: 
   { buf: <Buffer 30 2a 02 01 00 04 03 61 6e 79 a2 20 02 01 04 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 05 81 00>,
     len: 44 },
  dst: { family: 'udp4', address: '172.20.165.57', port: 50688 },
  snmpmsg: 
   SnmpMessage {
     _version: 
      SnmpInteger {
        _value: 0,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter] },
     _community: 
      SnmpOctetString {
        _value: <Buffer 61 6e 79>,
        typename: [Getter],
        tag: [Getter],
        value: [Getter/Setter] },
     _src: undefined,
     _raw: 
      { buf: <Buffer 30 2a 02 01 00 04 03 61 6e 79 a2 20 02 01 04 02 01 00 02 01 00 30 15 30 13 06 0f 2b 06 01 04 01 81 a2 67 01 02 01 01 01 02 05 81 00>,
        len: 44 },
     version: [Getter],
     community: [Getter],
     raw: [Getter],
     src: [Getter],
     pdu: [Getter/Setter],
     dst: { family: 'udp4', address: '172.20.165.57', port: 50688 },
     _pdu: 
      SnmpStdPDU {
        _op: 2,
        _varbinds: [Object],
        op: [Getter],
        varbinds: [Getter/Setter],
        _request_id: [Object],
        _error_status: [Object],
        _error_index: [Object],
        request_id: [Getter],
        error_status: [Getter/Setter],
        error_index: [Getter/Setter] } } } 'Sending SNMP response message' 15:44:53 | agent.js:159
**info:** Shutting down endpoint 0.0.0.0:161 15:44:53 | listener.js:52
**info:** [N/A] outgoing post /bridges/events/actual - 200 15:44:53 | post-bridge-message.js:31
