const resourceUtil = require('utils.resource')


const roleUpgrader = {
    run: function (creep) {
        if (creep.memory.upgrading && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.upgrading = false
            creep.say('harvest')
        } else if (!creep.memory.upgrading && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.upgrading = true
            creep.say('upgrading')
        }

        if (creep.memory.upgrading) {
            let controller = creep.room.controller
            if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, { visualizePathStyle: { stroke: '#fff' } })
            }
        } else {
            let store = resourceUtil.findClosestContainerOfSpawn()
            if (store) {
                resourceUtil.withDrawEnergyFromStructure(creep, store)
            } else {
                resourceUtil.park(creep)
            }
        }
    }
}

module.exports = roleUpgrader