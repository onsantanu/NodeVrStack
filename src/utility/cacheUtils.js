const commondao  	= 	require('../dao/commondao');
const client  		= 	require('../dbconnection').redisCon;
const util 		=	require('../utility/util');


let SaveTypeSpecLookUpInfo = async(lookupType)=>{
	try{
		var lookInfo = await commondao.getTypeSpecLookUpInfo(lookupType);
		var ltypeData  = {};
		if(lookInfo){
			for(let i=0;i<lookInfo.length;i++){
				if (lookInfo[i].lookupType in ltypeData){
				} else {
					ltypeData[lookInfo[i].lookupType] = [];
				}

				ltypeData[lookInfo[i].lookupType].push({"id":lookInfo[i].id,"name":lookInfo[i].lookupValue});
			}
			var lookUpTypes = Object.keys(ltypeData);
			for(let i=0;i<lookUpTypes.length;i++){
				client.set(lookUpTypes[i],JSON.stringify(ltypeData[lookUpTypes[i]]));
			}
		}
	}catch(err){
		let log 				=	util.createLog(err);
	}
};

module.exports.getTypeSpecLookUpInfo = async(lookupType)=>{
	var lookupData = await client.get(lookupType);
	if(lookupData!==null){
		return JSON.parse(lookupData);
	}else {
		await SaveTypeSpecLookUpInfo(lookupType);
		lookupData = await client.get(lookupType);
		if(lookupData!==null){
			return JSON.parse(lookupData);
		}else {
			return null;
		}
	}
};

let saveCountryList = async () => {
	try {
		const countryData = await commondao.getCountryList();
		if (countryData) {
			client.set('country', JSON.stringify(countryData))
		}
	} catch (e) {
		let log 				=	util.createLog(e);
	}
}

module.exports.getCountryList = async ()=>{
	let countryData = await client.get('country');
	if(countryData!==null){
		return JSON.parse(countryData);
	}else {
		await saveCountryList();
		countryData = await client.get('country');
		if(countryData!==null){
			return JSON.parse(countryData);
		}else {
			return null;
		}
	}
};

let saveStateListByCountry = async (countryId) => {
	try {
		const stateData = await commondao.getStateList(countryId);
		if (stateData) {
			client.set('countryId_' + countryId, JSON.stringify(stateData))
		}
	} catch (e) {
		let log 				=	util.createLog(e);
	}
}
module.exports.getStateListByCountry = async (countryId)=>{
	let stateData = await client.get('countryId_' + countryId);
	if(stateData!==null){
		return JSON.parse(stateData);
	}else {
		await saveStateListByCountry(countryId);
		stateData = await client.get('countryId_' + countryId);
		if(stateData!==null){
			return JSON.parse(stateData);
		}else {
			return null;
		}
	}
};
