var snmp = require('snmpjs');

function
createSentinelTrapData(prq)
{
console.log(prq);
	var val = snmp.data.createData({ type: 'Integer', value: 0 });
	snmp.provider.readOnlyScalar(prq, val);
}

var providers = [
  {
  	oid: '1.3.6.1.4.1.20839.1.2.1.1.1.2.1',
  	handler: createSentinelTrapData
  },
  {
  	oid: '1.3.6.1.4.1.20839.1.2.1.1.1.2.2',
  	handler: createSentinelTrapData
  },
  {
  	oid: '1.3.6.1.4.1.20839.1.2.1.1.1.2.3',
  	handler: createSentinelTrapData
  },
  {
  	oid: '1.3.6.1.4.1.20839.1.2.1.1.1.2.4',
  	handler: createSentinelTrapData
  },
  {
  	oid: '1.3.6.1.4.1.20839.1.2.1.1.1.2.5',
  	handler: createSentinelTrapData
  }
];

module.exports = providers;
