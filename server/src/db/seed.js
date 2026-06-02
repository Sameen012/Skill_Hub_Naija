const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const seedData = async () => {
  console.log('🌱 Seeding Database...');

  try {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE enrollments');
    await pool.query('TRUNCATE TABLE modules');
    await pool.query('TRUNCATE TABLE courses');
    await pool.query('TRUNCATE TABLE users');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    const defaultUsers = [
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'Instructor User',
        email: 'instructor@test.com',
        password: 'instructor123',
        role: 'instructor',
      },
    ];

    for (const user of defaultUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [user.name, user.email, hashedPassword, user.role]
      );
    }

    const courses = [
      {
        title: 'React.js for Beginners: Zero to Hero',
        category: 'Web Development',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
        description: 'Master React.js from scratch.',
        price: 0,
        type: 'self-paced',
        instructor: 'Code with Harry',
        modules: [
          { title: 'Introduction to React', duration: '10:20', videoUrl: 'https://www.youtube.com/embed/QFaFIcGhPoM' },
          { title: 'Hello World', duration: '05:30', videoUrl: 'https://www.youtube.com/embed/9hb_0TZ_MVI' },
        ],
      },
      {
        title: 'CSS Masterclass: Zero to Hero',
        category: 'Web Development',
        thumbnail: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2',
        description: 'Complete CSS course.',
        price: 0,
        type: 'self-paced',
        instructor: 'WsCube Tech',
        modules: [
          { title: 'Introduction to CSS', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/0W6qz0-aDaM' },
          { title: 'CSS Selectors', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/QgxkYbGr2II' },
        ],
      },
      {
        title: 'Graphic Design Fundamentals',
        category: 'Design',
        thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799314346d',
        description: 'Learn design principles.',
        price: 0,
        type: 'self-paced',
        instructor: 'Gareth David',
        modules: [
          { title: 'Beginner Guide', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/WONZVnlam6U' },
        ],
      },
      {
        title: 'Tailwind CSS for Beginners',
        category: 'Web Development',
        thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
        description: 'Rapidly build modern websites.',
        price: 0,
        type: 'self-paced',
        instructor: 'The Net Ninja',
        modules: [
          { title: 'Tailwind CSS Setup', duration: '08:20', videoUrl: 'https://www.youtube.com/embed/bxmDnn7lrnk' },
        ],
      },
    ];

    for (const course of courses) {
      const [result] = await pool.query(
        'INSERT INTO courses (title, category, thumbnail, description, price, type, instructor) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [course.title, course.category, course.thumbnail, course.description, course.price, course.type, course.instructor]
      );

      const courseId = result.insertId;

      for (const mod of course.modules) {
        await pool.query(
          'INSERT INTO modules (course_id, title, duration, video_url) VALUES (?, ?, ?, ?)',
          [courseId, mod.title, mod.duration, mod.videoUrl]
        );
      }
    }

    console.log('✅ Database Seeded Successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Failed:', err);
    process.exit(1);
  }
};

seedData();