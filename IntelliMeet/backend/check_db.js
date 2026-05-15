const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://IntelliMeet:IntelliMeet@ac-xilrkev-shard-00-00.mx5gmtz.mongodb.net:27017,ac-xilrkev-shard-00-01.mx5gmtz.mongodb.net:27017,ac-xilrkev-shard-00-02.mx5gmtz.mongodb.net:27017/intellimeet?ssl=true&replicaSet=atlas-ztgok7-shard-0&authSource=admin&retryWrites=true&w=majority');
  
  const Meeting = mongoose.model('Meeting', new mongoose.Schema({}, { strict: false }));
  const Availability = mongoose.model('Availability', new mongoose.Schema({}, { strict: false }));
  
  const meetings = await Meeting.find({ status: 'pending' }).lean();
  console.log("Pending Meetings:", JSON.stringify(meetings, null, 2));
  
  for (const m of meetings) {
    const avail = await Availability.findById(m.availabilityId).lean();
    console.log("Avail for", m._id, ":", avail);
  }
  
  process.exit(0);
}

run();
