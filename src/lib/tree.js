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

// แปลง tree ที่ซ้อนกันให้เป็น array แบนราบ (depth-first) พร้อมเก็บ depth ไว้
// ใช้ตอนอยากแสดงผลเป็นการ์ดกริดแบบเดียวกับทีมอื่น ๆ แทนแบบ tree ที่ซ้อนกัน
export function flattenTree(nodes, depth = 0) {
  const result = [];
  nodes.forEach((node) => {
    result.push({ ...node, depth });
    if (node.children?.length) {
      result.push(...flattenTree(node.children, depth + 1));
    }
  });
  return result;
}
