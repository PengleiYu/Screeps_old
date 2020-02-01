const roleUpgrader = require('role.upgrader')
const roleHarvester = require('role.harvester')
const roleBuilder = require('role.builder')

const ROLE_UPGRADER = 'upgrader'
const ROLE_HARVESTER = 'harvester'
const ROLE_BUILDER = 'builder'

class Role {
	constructor(role, body, script, max) {
		this.role = role
		this.body = body
		this.script = script
		this.max = max
		this.spawn = Game.spawns['Spawn1']
	}
	createIfNeed(list) {
		if (list.length < this.max) {
			let name = '' + this.role + Game.time
			let code = this.spawn.spawnCreep(this.body, name, {
				memory: { role: this.role }
			})
			if (code == OK)
				console.log('spawn a new creep: ' + name + ' ' +
					(code == OK ? 'success' : ('fail, code=' + code)))
		}
	}

	play() {
		let creepList = _.filter(Game.creeps, (creep) => creep.memory.role == this.role)
		this.createIfNeed(creepList)
		for (let creep of creepList) {
			this.script.run(creep)
		}
	}
}

const DEFAULT_BODY = [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
// const DEFAULT_BODY = [WORK, CARRY, MOVE] 
const roleList = [
	new Role(ROLE_HARVESTER, DEFAULT_BODY, roleHarvester, 1),
	new Role(ROLE_UPGRADER, DEFAULT_BODY, roleUpgrader, 1),
	new Role(ROLE_BUILDER, DEFAULT_BODY, roleBuilder, 3),
]

module.exports.loop = function () {
	for (let name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name]
			console.log(name + '已死亡，删除记忆')
		}
	}

	for (let role of roleList) {
		role.play()
	}
}