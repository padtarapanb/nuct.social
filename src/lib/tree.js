// แปลง array แบบ flat (มี id, parent_id) ให้เป็นโครงสร้าง tree ซ้อนกัน
export function buildTree(flatRows) {
  const byId = {};
  flatRows.forEach((row) => {
    byId[row.id] = { ...row, children: [] };
  });

  const roots = [];
  flatRows.forEach((row) => {
    if (row.parent_id && byId[row.parent_id]) {
      byId[row.parent_id].children.push(byId[row.id]);
    } else {
      roots.push(byId[row.id]);
    }
  });

  const sortRecursive = (nodes) => {
    nodes.sort((a, b) => a.sort_order - b.sort_order);
    nodes.forEach((n) => sortRecursive(n.children));
  };
  sortRecursive(roots);

  return roots;
}
