const pool = require('../utils/db');

const getMember = async () => {
  let [data] = await pool.execute('SELECT * FROM member');
  return data;
};

module.exports = { getMember };
