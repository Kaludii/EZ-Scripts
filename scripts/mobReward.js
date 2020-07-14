import {
	getBalance,
	updateBalance
} from "ez:economy";

import {
	getPlayerByNAME
} from "ez:player";


const system = server.registerSystem(0, 0);

function randomReward(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return ((Math.random() * (max - min + 1)) | 0) + min;
}

function percentage(num){
	if (LootPercentage > 100) {
		console.log("Please do not enter a percentage that is higher than 100");
		let LootPercentage = 100;
		return (num/100)*LootPercentage;
	}
	else {
		return (num/100)*LootPercentage;
	}
}

//customize the percentage of player losing money when get killed by another player
let LootPercentage = 5

system.listenForEvent("minecraft:entity_death", ({data: eventData}) => {
	//customize how much money should a mob drop (min, max)
	const mobs = {
		"zombie" : randomReward(10,15),
		"zombie_villager_v2" : randomReward(14,20),
		"husk" : randomReward(5,8),
		"skeleton" : randomReward(7,9),
		"stray" : randomReward(1,1),
		"creeper" : randomReward(10,15),
		"spider" : randomReward(10,15),
		"cave_spider" : randomReward(10,15),
		"witch" : randomReward(20,30),
		"phantom" : randomReward(10,20),
		"blaze" : randomReward(13,22),
		"ghast" : randomReward(30,36),
		"ender_dragon" : randomReward(2000,2000),
		"piglin" : randomReward(10,30),
		"zoglin" : randomReward(20,22),
		"player" : randomReward(50,60)
	};

	const {
		entity: deadEntity,
		killer
	} = eventData;
	const kill = system.getComponent(killer, "minecraft:nameable").data.name;
	const deadEntityIdentifier = deadEntity.__identifier__.replace("minecraft:", "");
	const killerName = getPlayerByNAME(kill);
	
	if (deadEntityIdentifier in mobs) {
		if (deadEntity.__identifier__ === "minecraft:player") {
			const moneyOld = getBalance(killerName);
			const victim = system.getComponent(deadEntity, "minecraft:nameable").data.name;
			const victimName = getPlayerByNAME(victim);
			const victimMoney = getBalance(victimName);
			const result = percentage(victimMoney);
			const victimLoot = Math.round(result);
			const deductVictimLoot = victimLoot * -1;
			updateBalance(killerName, victimLoot, "add");
			system.executeCommand(`title "${killerName.name}" actionbar §fYou earned §e$${victimLoot} §a(${LootPercentage} Percent) §ffor killing §6${victimName.name}\n§7Previous: §b${moneyOld} §7=> Now: §b${getBalance(killerName)}`, () => {});
			updateBalance(victimName, deductVictimLoot, "deduct");
			system.executeCommand(`tellraw @a {"rawtext":[{"text":"§6${victimName.name} §flost §e$${victimLoot} §a(${LootPercentage} Percent) §ffor getting killed by §6${killerName.name}\n§7Previous: §b${victimMoney} §7=> Now: §b${getBalance(victimName)}"}]}`, () => {});
		}
		else {
			let moneyOld = getBalance(killerName)
			updateBalance(killerName, mobs[deadEntityIdentifier], "add");
			system.executeCommand(`title "${killerName.name}" actionbar §fYou earned §e$${mobs[deadEntityIdentifier]} §ffor killing §6${deadEntityIdentifier}\n§7Previous: §b${moneyOld} §7=> Now: §b${getBalance(killerName)}`, () => {});
		}
	}
	else{
		system.executeCommand(`title "${killerName.name}" actionbar §fYou killed §6${deadEntityIdentifier}`, () => {});
	}
})
console.log("mobReward.js loaded");