const spawn = Game.spawns['Spawn1']
const resourceUtil = {
    findClosestContainerOfSpawn: (empty) => {
        return spawn.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (it) => it.structureType == STRUCTURE_CONTAINER
                && (empty ? it.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    : it.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
        })
    },
    withDrawEnergyFromStructure: (creep, structure) => {
        if (structure) {
            if (!creep.pos.isNearTo(structure)) {
                creep.moveTo(structure, { visualizePathStyle: { stroke: '#fff' } })
            } else {
                creep.withdraw(structure, RESOURCE_ENERGY)
            }
        }
    },
    park: (creep) => {
        // 停靠在空地
        creep.moveTo(spawn, { visualizePathStyle: { stroke: '#fff' } })
    }
}

module.exports = resourceUtil