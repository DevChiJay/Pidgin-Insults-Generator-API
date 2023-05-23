const fs = require('node:fs/promises');

const Insult = require('../models/insults.model');
const { NotFoundError } = require('../util/errors');

const readData = async () => {
  const data = await fs.readFile('new-insults.json', 'utf8');
  return JSON.parse(data);
};

const writeData = async (data) => {
  await fs.writeFile('new-insults.json', JSON.stringify(data));
};

const getRandomInsult = async (req, res, next) => {
  try {
    const insults = await Insult.find();
    const csrfToken = req.csrfToken();
    if (!insults || insults.length === 0) {
      throw new NotFoundError('Could not find any insults.');
    }
    const random = Math.floor(Math.random() * insults.length);
    res.json({ insult: insults[random].title, CSRFToken: csrfToken });
  } catch (error) {
    return next(error);
  }
};

const getAllNew = async (req, res, next) => {
  try {
    const storedData = await readData();
    res.json(storedData);
  } catch (error) {
    return next(error);
  }
};

const addInsult = async (req, res, next) => {
  try {
    const storedData = await readData();
    let insultKey;
    if (storedData <= 0) {
      insultKey = 0;
    } else {
      insultKey = storedData[0].key + 1;
    }

    const insult = {
      ...req.body,
      status: 'Pending',
      key: insultKey,
    };
    storedData.unshift(insult);

    await fs.writeFile('new-insults.json', JSON.stringify(storedData));
    res.json({ message: 'Insult added successfully!' });
  } catch (error) {
    return next(error);
  }
};

const saveInsult = async (req, res, next) => {
  const insultKey = +req.params.key;
  try {
    const storedData = await readData();
    const insult = storedData.find((insult) => insult.key === insultKey);
    const updatedData = storedData.filter((insult) => insult.key !== insultKey);
    insult.status = 'Active';

    const saveInsult = new Insult(insult);

    await saveInsult.save();
    await writeData(updatedData);
    res.json({ message: 'Insult saved successfully' });
  } catch (error) {
    return next(error);
  }
};

const removePendingInsults = async (req, res, next) => {
  try {
    const storedData = await readData();
    const updatedData = storedData.filter(
      (insult) => insult.status !== 'Pending'
    );
    await writeData(updatedData);
    res.json({ message: 'Pending insults removed successfully!' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getRandomInsult: getRandomInsult,
  getAllNew: getAllNew,
  addInsult: addInsult,
  saveInsult: saveInsult,
  removePendingInsults: removePendingInsults,
};
