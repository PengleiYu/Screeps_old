const RESOURCE_UTIL = require('utils.resource')
const roleRepairer = {
    run: (creep) => {
        if (creep.memory.repairing && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.repairing = false
            creep.say('harvesting')
        } else if (!creep.memory.repairing && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.repairing = true
            creep.say('repairing')
        }

        if (creep.memory.repairing) {
            let struct = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (it) => it.hits < it.hitsMax
            })
            if (struct) {
                if (creep.repair(struct) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(struct)
                }
            }
        } else {
            let container = RESOURCE_UTIL.findClosestContainerOfSpawn()
            if (container) {
                RESOURCE_UTIL.withDrawEnergyFromStructure(creep, container)
            } else {
                RESOURCE_UTIL.park(creep)
            }
        }
    }
}
module.exports = roleRepairer