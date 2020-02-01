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
            const controller = creep.room.controller
            if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, { visualizePathStyle: { stroke: '#fff' } })
            }
        } else {
            const resource = creep.room.find(FIND_SOURCES)[0]
            if (creep.harvest(resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(resource, { visualizePathStyle: { stroke: '#fff' } })
            }
        }
    }
}

module.exports = roleUpgrader