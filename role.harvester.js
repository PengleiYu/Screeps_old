var resourceUtil = require('utils.resource')

const roleHarvester = {
    run: function (creep) {
        if (creep.memory.transfering && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.transfering = false
            creep.say('harvesting', { visualizePathStyle: { stroke: '#fff' } })
        } else if (!creep.memory.transfering && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.transfering = true
            creep.say('transfering', { visualizePathStyle: { stroke: '#fff' } })
        }

        if (!creep.memory.transfering) {
            let container = resourceUtil.findClosestContainerOfSpawn()
            if (container) {
                resourceUtil.withDrawEnergyFromStructure(creep, container)
            } else {
                // resourceUtil.park(creep)
                resourceUtil.harvestEnergyFromResource(creep,
                    resourceUtil.findClosestResourceOfSpawn())
            }
        } else {
            // 先找container，找不到再找其他有store的建筑
            // FIND_MY_STRUCTURES不能找到container
            let structureList = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (it) => !!it.store
                    && it.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            })
            if (structureList.length) {
                let structure = structureList[0]
                let transferCode = creep.transfer(structure, RESOURCE_ENERGY)
                if (transferCode == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, { visualizePathStyle: { stroke: '#fff' } })
                }
            } else {
                resourceUtil.park(creep)
            }
        }
    }
}

module.exports = roleHarvester