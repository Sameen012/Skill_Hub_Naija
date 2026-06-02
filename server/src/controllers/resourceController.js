const pool = require('../config/db');

const ensureResourcesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS resources (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      course_id INT NULL,
      file_name VARCHAR(255) NOT NULL,
      file_type VARCHAR(100) NOT NULL,
      file_size INT NOT NULL,
      file_data LONGBLOB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
    )
  `);
};

const mapResourceRow = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  courseId: row.course_id,
  courseTitle: row.course_title || null,
  fileName: row.file_name,
  fileType: row.file_type,
  fileSize: row.file_size,
  createdAt: row.created_at,
  downloadUrl: `/resources/${row.id}/download`,
});

const getResources = async (req, res) => {
  try {
    await ensureResourcesTable();

    const [rows] = await pool.query(
      `SELECT r.*, c.title AS course_title
       FROM resources r
       LEFT JOIN courses c ON c.id = r.course_id
       ORDER BY r.created_at DESC`
    );

    res.json(rows.map(mapResourceRow));
  } catch (error) {
    console.error('Get resources error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const createResource = async (req, res) => {
  try {
    await ensureResourcesTable();

    const { title, description = '', courseId = 'all' } = req.body;
    const file = req.file;

    if (!title || !file) {
      return res.status(400).json({ error: 'Title and PDF file are required' });
    }

    const normalizedCourseId = courseId === 'all' ? null : Number(courseId) || null;

    const [result] = await pool.query(
      `INSERT INTO resources (title, description, course_id, file_name, file_type, file_size, file_data)
       VALUES (?, ?, ?, ?, ?, ?, ?)` ,
      [
        title,
        description,
        normalizedCourseId,
        file.originalname,
        file.mimetype,
        file.size,
        file.buffer,
      ]
    );

    const [rows] = await pool.query(
      `SELECT r.*, c.title AS course_title
       FROM resources r
       LEFT JOIN courses c ON c.id = r.course_id
       WHERE r.id = ?`,
      [result.insertId]
    );

    res.status(201).json(mapResourceRow(rows[0]));
  } catch (error) {
    console.error('Create resource error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const downloadResource = async (req, res) => {
  try {
    await ensureResourcesTable();

    const [rows] = await pool.query('SELECT * FROM resources WHERE id = ?', [req.params.id]);

    if (!rows.length) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const resource = rows[0];
    res.setHeader('Content-Type', resource.file_type);
    res.setHeader('Content-Disposition', `attachment; filename="${resource.file_name}"`);
    res.send(resource.file_data);
  } catch (error) {
    console.error('Download resource error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteResource = async (req, res) => {
  try {
    await ensureResourcesTable();

    const [result] = await pool.query('DELETE FROM resources WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getResources,
  createResource,
  downloadResource,
  deleteResource,
};