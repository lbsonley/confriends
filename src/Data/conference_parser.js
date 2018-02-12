/* eslint-disable */
const path = require('path');
const fs = require('fs');

// const regex = /\[\*\*(.*)\*\*\]\((.*)\)[\s]*(.*)[\s]*(.*)\,\s\*\*(.*)\*\*/g;
const regex = /\[\*\*(.*)\*\*\]\((.*)\)[\s]*(.*[0-9])[\s]*(.*)\,\s\*\*(.*)\*\*/g;

fs.readFile('./conferences.md', 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }

  const matches = data.match(regex);

  const groups = [];

  matches.forEach((match, index) => {
    const dataObj = {
      name: '',
      website: '',
      date: '',
      location: { city: '', country: '' },
    };
    // console.log(match, index);
    const group = regex.exec(match);
    if (group) {
      // console.log(group[3]);
      dataObj.name = group[1];
      dataObj.website = group[2];
      dataObj.date = group[3];
      dataObj.location.city = group[4];
      dataObj.location.country = group[5];

      groups.push(dataObj);
    }
  });

  console.log(groups);

  fs.writeFile(
    './../../../dist/conferenceslong.json',
    JSON.stringify(groups),
    err => {
      if (err) console.log(err);
      console.log('file saved');
    },
  );
});
