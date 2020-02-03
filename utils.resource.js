const spawn = Game.spawns['Spawn1']
// 寻找离spawn最近的resource
const findClosestResourceOfSpawn = () => {
    return spawn.pos.findClosestByRange(FIND_SOURCES)
}
// 寻找离spawn最近的container
const findClosestContainerOfSpawn = (hasEmpty) => {
    return spawn.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (it) => it.structureType == STRUCTURE_CONTAINER
            && (hasEmpty ? it.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                : it.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
    })
}
// 从container中取回resource
const withDrawEnergyFromStructure = (creep, structure) => {
    if (structure) {
        if (!creep.pos.isNearTo(structure)) {
            creep.moveTo(structure, { visualizePathStyle: { stroke: '#fff' } })
        } else {
            creep.withdraw(structure, RESOURCE_ENERGY)
        }
    }
}
// 采集resource
const harvestEnergyFromResource = (creep, resource) => {
    if (resource && creep) {
        if (creep.harvest(resource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(resource, { visualizePathStyle: { stroke: '#fff' } })
        }
    }
}
// 采集离spawn最近的resource
const harvestClosestResourceOfSpawn = (creep) => {
    harvestEnergyFromResource(creep, findClosestResourceOfSpawn())
}
// 停靠（spawn附近）
const park = (creep) => {
    // 停靠在空地
    creep.moveTo(spawn, { visualizePathStyle: { stroke: '#fff' } })
}

module.exports = {
    findClosestContainerOfSpawn: findClosestContainerOfSpawn,
    findClosestResourceOfSpawn: findClosestResourceOfSpawn,
    withDrawEnergyFromStructure: withDrawEnergyFromStructure,
    harvestEnergyFromResource: harvestEnergyFromResource,
    harvestClosestResourceOfSpawn: harvestClosestResourceOfSpawn,
    park: park,
}