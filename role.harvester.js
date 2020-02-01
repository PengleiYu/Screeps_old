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
            let resource = creep.room.find(FIND_SOURCES)[0]
            if (creep.harvest(resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(resource, { visualizePathStyle: { stroke: '#fff' } })
            }
        } else {
            let structureList = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (it) => !!it.store && it.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            })
            if (structureList.length) {
                let structure = structureList[structureList.length - 1]
                let transferCode = creep.transfer(structure, RESOURCE_ENERGY)
                if (transferCode == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, { visualizePathStyle: { stroke: '#fff' } })
                }
            } else {
                // 停靠在空地
                creep.moveTo(Game.spawns['Spawn1'], { visualizePathStyle: { stroke: '#fff' } })
            }
        }
    }
}

module.exports = roleHarvester