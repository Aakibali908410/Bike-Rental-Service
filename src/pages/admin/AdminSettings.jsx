import AdminLayout from '../../layouts/AdminLayout';
import { AdminPage } from './AdminUI';

const AdminSettings = () => <AdminLayout><AdminPage eyebrow="Workspace" title="Settings" description="Platform configuration and operational preferences."><section className="rounded-2xl border border-border bg-secondary p-6 text-text"><h2 className="text-xl font-bold">Platform Configuration</h2><p className="mt-2 text-textSecondary">Connected to Bikes Rental Service Express backend and MongoDB Atlas cluster. System parameters and operational policies are enforced securely by backend controllers.</p></section></AdminPage></AdminLayout>;

export default AdminSettings;
