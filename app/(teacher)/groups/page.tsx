import { getGroups, getLevels } from '@/actions/groups';
import { GroupManager } from '@/components/groups/group-manager';

export const dynamic = 'force-dynamic';

export default async function GroupsPage() {
  const [groups, levels] = await Promise.all([
    getGroups(),
    getLevels(),
  ]);

  return <GroupManager initialGroups={groups} levels={levels} />;
}
