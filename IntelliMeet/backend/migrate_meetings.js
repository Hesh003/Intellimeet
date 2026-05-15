const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://IntelliMeet:IntelliMeet@ac-xilrkev-shard-00-00.mx5gmtz.mongodb.net:27017,ac-xilrkev-shard-00-01.mx5gmtz.mongodb.net:27017,ac-xilrkev-shard-00-02.mx5gmtz.mongodb.net:27017/intellimeet?ssl=true&replicaSet=atlas-ztgok7-shard-0&authSource=admin&retryWrites=true&w=majority');
  
  const Meeting = mongoose.model('Meeting', new mongoose.Schema({}, { strict: false }));
  const Availability = mongoose.model('Availability', new mongoose.Schema({}, { strict: false }));
  
  const meetings = await Meeting.find({ 
    $or: [
      { startTime: { $exists: false } },
      { endTime: { $exists: false } },
      { requirement: { $exists: false } }
    ]
  });
  
  console.log("Found missing fields in", meetings.length, "meetings");
  
  for (const m of meetings) {
    const avail = await Availability.findById(m.availabilityId).lean();
    if (avail) {
      await Meeting.updateOne({ _id: m._id }, {
        $set: {
          startTime: m.startTime || avail.startTime || '00:00',
          endTime: m.endTime || avail.endTime || '00:00',
          requirement: m.requirement || 'Other academic matters'
        }
      });
    }
  }
  console.log("Migration done");
  process.exit(0);
}

run();
