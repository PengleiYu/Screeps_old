const roleUpgrader = require('role.upgrader')
const roleHarvester = require('role.harvester')
const roleBuilder = require('role.builder')
const roleSoldier = require('role.soldier')
const roleRepairer = require('role.repairer')
const roleMiner = require('role.miner')

const ROLE_UPGRADER = 'upgrader'
const ROLE_HARVESTER = 'harvester'
const ROLE_BUILDER = 'builder'
const ROLE_SOLDIER = 'soldier'
const ROLE_REPAIRER = 'repairer'
const ROLE_MINER = 'miner'

const ROLE_WHICH_LOG = ROLE_REPAIRER

class Role {
	constructor(role, body, script, max, waitMax = false) {
		this.role = role
		this.body = body
		this.script = script
		this.max = max
		this.spawn = Game.spawns['Spawn1']
		this.waitMax = waitMax
	}
	createIfNeed(list) {
		if (list.length < this.max) {
			if (this.spawn.spawning) {
				return
			}

			let name = '' + this.role + Game.time
			let code = this.spawn.spawnCreep(this.body, name, {
				memory: {
					role: this.role,
					directions: [BOTTOM]
				}
			})
			if (code == OK) {
				this.log('spawn a new creep: ' + name + 'success')
			} else {
				if (this.role == ROLE_WHICH_LOG) {
					this.log('spawn a new creep: ' + name + ' ' + code)
				}
			}
		}
	}

	play() {
		let creepList = _.filter(Game.creeps, (creep) =>
			creep.memory.role == this.role)
		this.createIfNeed(creepList)
		for (let creep of creepList) {
			this.script.run(creep)
		}
	}
	log(msg) {
		console.log('Role ' + this.role + ':' + msg)
	}
}

const LITTLE_BODY = [WORK, CARRY, MOVE]
const MEDIUM_BODY = [WORK, WORK, CARRY, CARRY, MOVE, MOVE]

const HARVESTER_BODY = [CARRY, CARRY, MOVE, MOVE]
const MINER_BODY = [WORK, WORK, WORK, CARRY, MOVE]
const UPGRADER_BODY = LITTLE_BODY
const BUILDER_BODY = LITTLE_BODY
const SOLDIER_BODY = [MOVE, MOVE, TOUGH, TOUGH, TOUGH, ATTACK]
const REPAIRER_BODY = LITTLE_BODY

const roleList = [
	new Role(ROLE_MINER, MINER_BODY, roleMiner, 1),
	new Role(ROLE_HARVESTER, HARVESTER_BODY, roleHarvester, 1),
	new Role(ROLE_UPGRADER, UPGRADER_BODY, roleUpgrader, 1),
	new Role(ROLE_BUILDER, BUILDER_BODY, roleBuilder, 1),
	new Role(ROLE_REPAIRER, REPAIRER_BODY, roleRepairer, 1),
	// new Role(ROLE_SOLDIER, SOLDIER_BODY, roleSoldier, 3, true),
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