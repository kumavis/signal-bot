const { promisify } = require('util')
const DBus = require('dbus')

main()

async function main () {
  const bus = DBus.getBus('session');
  const iface = await promisify(cb => bus.getInterface('org.asamk.Signal', '/org/asamk/Signal', 'org.asamk.Signal', cb))()
  
  iface.on('MessageReceived', async (timestamp, sender, groupId, message, attachments) => {
    const isGroup = groupId.length > 0
    console.log('MessageReceived', {timestamp, sender, groupId, message, attachments, isGroup})
    
    const response = `i saw: "${message}"`
    if (isGroup) {
      await promisify(cb => iface.sendGroupMessage(response, [], groupId, cb))()
    } else {
      await promisify(cb => iface.sendMessage(response, [], [sender], cb))()
    }
  })

  const [groupsData] = await promisify(cb => iface.listGroups(cb))()
  // [
  //   {
  //     '/org/asamk/Signal/Groups/Q7EYptV9K8gYYqx_6km4NtGmb_KE9nntP3GNAgcSjxM_': [
  //        67, 177,  24, 166, 213, 125,  43, 200,
  //        24,  98, 172, 127, 234,  73, 184,  54,
  //       209, 166, 111, 242, 132, 246, 121, 237,
  //        63, 113, 141,   2,   7,  18, 143,  19
  //     ],
  //     '/org/asamk/Signal/Groups/oQB1YlEqMY9wdm5Zt0N2ES0I_wlRou1GaQ8bP44miaI_': [
  //       161,   0, 117, 98,  81,  42,  49, 143,
  //       112, 118, 110, 89, 183,  67, 118,  17,
  //        45,   8, 255,  9,  81, 162, 237,  70,
  //       105,  15,  27, 63, 142,  38, 137, 162
  //     ]
  //   }
  // ]  
  // for (const [groupPath, groupId] of Object.entries(groupsData)) {
  //   await promisify(cb => iface.sendGroupMessage('hello from node', [], groupId, cb))()
  // }
  console.log(groupsData)

  // const groupId = groupsData['/org/asamk/Signal/Groups/oQB1YlEqMY9wdm5Zt0N2ES0I_wlRou1GaQ8bP44miaI_']
  // await promisify(cb => iface.sendGroupMessage('hello from node', [], groupId, cb))()



  // bus.disconnect()
}

