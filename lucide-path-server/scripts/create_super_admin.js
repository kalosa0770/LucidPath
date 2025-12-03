import 'dotenv/config';
import connectDB from '../config/mongodb.js';
import SuperAdmin from '../models/superAdminModel.js';
import bcrypt from 'bcryptjs';

async function main() {
  try {
    await connectDB();

    const existing = await SuperAdmin.findOne({});
    if (existing) {
      console.log('A super admin already exists. Aborting.');
      console.log('Existing:', { _id: existing._id.toString(), email: existing.email });
      process.exit(0);
    }

    // Read values from environment variables if provided, otherwise use defaults
    const firstName = process.env.SEED_FIRST_NAME || 'Super';
    const lastName = process.env.SEED_LAST_NAME || 'Admin';
    const email = process.env.SEED_EMAIL || 'admin@gmail.com';
    const phone = process.env.SEED_PHONE || '0770940809';
    const password = process.env.SEED_PASSWORD || 'superAdmin@12345';
    const title = process.env.SEED_TITLE || 'Admin';

    const hashed = await bcrypt.hash(password, 10);

    const newAdmin = await SuperAdmin.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashed,
      title,
      permissions: {
        canManageProviders: true,
        canManageUsers: true,
        canModerateForum: true
      }
    });

    console.log('Super admin created successfully:');
    console.log({ _id: newAdmin._id.toString(), email: newAdmin.email });
    process.exit(0);
  } catch (err) {
    console.error('Error creating super admin:', err);
    process.exit(1);
  }
}

main();
