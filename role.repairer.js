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

        // 修理逻辑：优先找损坏的大门，其次损坏的其他建筑
        if (creep.memory.repairing) {
            let struct = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (it) => it.structureType == STRUCTURE_RAMPART && it.hits < it.hitsMax
            })
            if (!struct) {
                struct = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (it) => it.hits < it.hitsMax
                })
            }
            if (struct) {
                if (creep.repair(struct) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(struct, { visualizePathStyle: { stroke: '#fff' } })
                }
            } else {
                RESOURCE_UTIL.park(creep)
            }
        } else {
            // 获取能量逻辑：优先最近的container，没有则停车
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