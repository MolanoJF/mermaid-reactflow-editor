import { Node, Edge } from 'reactflow';
import { ALIGNMENT_TYPES, DISTRIBUTION_TYPES, AlignmentType, DistributionType } from '@/constants';

export function alignNodes(
  nodes: Node[],
  selectedNodes: Node[],
  alignment: AlignmentType
): Node[] {
  if (selectedNodes.length < 2) return nodes;
  const bounds = selectedNodes.map(node => ({
    id: node.id,
    x: node.position.x,
    y: node.position.y,
    width: node.width || 150,
    height: node.height || 50,
  }));
  let newNodes = [...nodes];
  switch (alignment) {
    case ALIGNMENT_TYPES.LEFT:
      const leftX = Math.min(...bounds.map(b => b.x));
      bounds.forEach(bound => {
        const nodeIndex = newNodes.findIndex(n => n.id === bound.id);
        if (nodeIndex !== -1) {
          newNodes[nodeIndex] = { ...newNodes[nodeIndex], position: { ...newNodes[nodeIndex].position, x: leftX } };
        }
      });
      break;
    case ALIGNMENT_TYPES.RIGHT:
      const rightX = Math.max(...bounds.map(b => b.x + b.width));
      bounds.forEach(bound => {
        const nodeIndex = newNodes.findIndex(n => n.id === bound.id);
        if (nodeIndex !== -1) {
          newNodes[nodeIndex] = { ...newNodes[nodeIndex], position: { ...newNodes[nodeIndex].position, x: rightX - bound.width } };
        }
      });
      break;
    case ALIGNMENT_TYPES.TOP:
      const topY = Math.min(...bounds.map(b => b.y));
      bounds.forEach(bound => {
        const nodeIndex = newNodes.findIndex(n => n.id === bound.id);
        if (nodeIndex !== -1) {
          newNodes[nodeIndex] = { ...newNodes[nodeIndex], position: { ...newNodes[nodeIndex].position, y: topY } };
        }
      });
      break;
    case ALIGNMENT_TYPES.BOTTOM:
      const bottomY = Math.max(...bounds.map(b => b.y + b.height));
      bounds.forEach(bound => {
        const nodeIndex = newNodes.findIndex(n => n.id === bound.id);
        if (nodeIndex !== -1) {
          newNodes[nodeIndex] = { ...newNodes[nodeIndex], position: { ...newNodes[nodeIndex].position, y: bottomY - bound.height } };
        }
      });
      break;
    // Center nodes horizontally (align their centers on the X axis)
    case ALIGNMENT_TYPES.CENTER_HORIZONTAL: {
      const avgX = bounds.reduce((sum, b) => sum + b.x + b.width / 2, 0) / bounds.length;
      bounds.forEach(bound => {
        const nodeIndex = newNodes.findIndex(n => n.id === bound.id);
        if (nodeIndex !== -1) {
          newNodes[nodeIndex] = { ...newNodes[nodeIndex], position: { ...newNodes[nodeIndex].position, x: avgX - bound.width / 2 } };
        }
      });
    }
      break;

    // Center nodes vertically (align their centers on the Y axis)
    case ALIGNMENT_TYPES.CENTER_VERTICAL: {
      const avgY = bounds.reduce((sum, b) => sum + b.y + b.height / 2, 0) / bounds.length;
      bounds.forEach(bound => {
        const nodeIndex = newNodes.findIndex(n => n.id === bound.id);
        if (nodeIndex !== -1) {
          newNodes[nodeIndex] = { ...newNodes[nodeIndex], position: { ...newNodes[nodeIndex].position, y: avgY - bound.height / 2 } };
        }
      });
    }
      break;
  }
  return newNodes;
}

export function distributeNodes(
  nodes: Node[],
  selectedNodes: Node[],
  direction: DistributionType
): Node[] {
  if (selectedNodes.length < 3) return nodes;
  const bounds = selectedNodes.map(node => ({
    id: node.id,
    x: node.position.x,
    y: node.position.y,
    width: node.width || 150,
    height: node.height || 50,
    // keep centers available if needed elsewhere
    centerX: node.position.x + (node.width || 150) / 2,
    centerY: node.position.y + (node.height || 50) / 2,
  }));
  let newNodes = [...nodes];
  if (direction === DISTRIBUTION_TYPES.HORIZONTAL) {
    // Sort by left edge
    bounds.sort((a, b) => a.x - b.x);
    const leftEdge = bounds[0].x;
    const rightEdge = bounds[bounds.length - 1].x + bounds[bounds.length - 1].width;
    const totalWidths = bounds.reduce((s, b) => s + b.width, 0);
    // available space between outer edges minus widths
    const available = rightEdge - leftEdge - totalWidths;
    // spacing between adjacent node edges (clamp to 0 to avoid negative spacing)
    const spacing = Math.max(0, available / (bounds.length - 1));
    // place nodes sequentially starting from leftEdge
    let cursor = leftEdge;
    bounds.forEach((bound) => {
      const nodeIndex = newNodes.findIndex(n => n.id === bound.id);
      if (nodeIndex !== -1) {
        const newX = cursor;
        newNodes[nodeIndex] = { ...newNodes[nodeIndex], position: { ...newNodes[nodeIndex].position, x: newX } };
        cursor += bound.width + spacing;
      }
    });
  } else {
    // Sort by top edge
    bounds.sort((a, b) => a.y - b.y);
    const topEdge = bounds[0].y;
    const bottomEdge = bounds[bounds.length - 1].y + bounds[bounds.length - 1].height;
    const totalHeights = bounds.reduce((s, b) => s + b.height, 0);
    const available = bottomEdge - topEdge - totalHeights;
    const spacing = Math.max(0, available / (bounds.length - 1));
    let cursor = topEdge;
    bounds.forEach((bound) => {
      const nodeIndex = newNodes.findIndex(n => n.id === bound.id);
      if (nodeIndex !== -1) {
        const newY = cursor;
        newNodes[nodeIndex] = { ...newNodes[nodeIndex], position: { ...newNodes[nodeIndex].position, y: newY } };
        cursor += bound.height + spacing;
      }
    });
  }
  return newNodes;
}

export function bringToFront(nodes: Node[], selectedNodes: Node[]): Node[] {
  const subgraphNodes = nodes.filter(n => n.type === 'group');
  const regularNodes = nodes.filter(n => n.type !== 'group');

  const maxSubgraphZ = subgraphNodes.length > 0 ? Math.max(...subgraphNodes.map(n => n.zIndex || -50)) : -50;
  const maxRegularZ = regularNodes.length > 0 ? Math.max(...regularNodes.map(n => n.zIndex || 0)) : 0;

  return nodes.map(node => {
    if (!selectedNodes.some(sn => sn.id === node.id)) return node;
    
    if (node.type === 'group') {
      // Bring to front of other subgraphs, but keep below nodes
      // Capped at -1 to ensure it stays in the negative range
      return { ...node, zIndex: Math.min(-1, maxSubgraphZ + 1) };
    } else {
      // Bring to front of other nodes
      return { ...node, zIndex: maxRegularZ + 1 };
    }
  });
}

export function sendToBack(nodes: Node[], selectedNodes: Node[]): Node[] {
  const subgraphNodes = nodes.filter(n => n.type === 'group');
  const regularNodes = nodes.filter(n => n.type !== 'group');

  const minSubgraphZ = subgraphNodes.length > 0 ? Math.min(...subgraphNodes.map(n => n.zIndex || -50)) : -50;
  const minRegularZ = regularNodes.length > 0 ? Math.min(...regularNodes.map(n => n.zIndex || 0)) : 0;

  return nodes.map(node => {
    if (!selectedNodes.some(sn => sn.id === node.id)) return node;
    
    if (node.type === 'group') {
      // Send to back of other subgraphs
      return { ...node, zIndex: minSubgraphZ - 1 };
    } else {
      // Send to back of other nodes, but keep above subgraphs
      // Minimum 0 to ensure it stays in the positive range
      return { ...node, zIndex: Math.max(0, minRegularZ - 1) };
    }
  });
}

// Counter to ensure unique IDs even when duplicating rapidly
let duplicateCounter = 0;

export function duplicateNodes(nodes: Node[], selectedNodes: Node[]): Node[] {
  const newNodes = [...nodes];
  const timestamp = Date.now();
  selectedNodes.forEach(node => {
    const newNode: Node = {
      ...node,
      id: `${node.id}_copy_${timestamp}_${duplicateCounter++}`,
      position: { x: node.position.x + 50, y: node.position.y + 50 },
      selected: false,
    };
    newNodes.push(newNode);
  });
  return newNodes;
}

// Helper to calculate absolute position of a node in the hierarchy
export function getAbsolutePosition(node: Node, allNodes: Node[]): { x: number, y: number } {
  let x = node.position.x;
  let y = node.position.y;
  let current = node;
  
  while (current.parentNode) {
    const parent = allNodes.find(n => n.id === current.parentNode);
    if (!parent) break;
    x += parent.position.x;
    y += parent.position.y;
    current = parent;
  }
  
  return { x, y };
}

export function deleteSelected(nodes: Node[], edges: Edge[], selectedNodes: Node[], selectedEdges: Edge[]) {
  const nodeIdsToDelete = new Set(selectedNodes.map(n => n.id));
  const edgeIdsToDelete = new Set(selectedEdges.map(e => e.id));
  
  // We want to keep any node that isn't explicitly selected for deletion
  // If its parent is deleted, we "ungroup" it by making it top-level or attaching to a surviving grandparent
  const newNodes = nodes
    .filter(node => !nodeIdsToDelete.has(node.id))
    .map(node => {
      // If this node's parent is being deleted, we need to transform its coordinates
      if (node.parentNode && nodeIdsToDelete.has(node.parentNode)) {
        const absPos = getAbsolutePosition(node, nodes);
        
        // Try to find a surviving ancestor to attach to
        let nextParentId = node.parentNode;
        let survivingAncestor: Node | undefined;
        
        while (nextParentId) {
          const parent = nodes.find(n => n.id === nextParentId);
          if (!parent) break;
          
          if (!nodeIdsToDelete.has(parent.id)) {
            survivingAncestor = parent;
            break;
          }
          nextParentId = parent.parentNode!;
        }

        if (survivingAncestor) {
          const ancestorAbsPos = getAbsolutePosition(survivingAncestor, nodes);
          return {
            ...node,
            parentNode: survivingAncestor.id,
            position: {
              x: absPos.x - ancestorAbsPos.x,
              y: absPos.y - ancestorAbsPos.y
            }
          };
        } else {
          // No surviving ancestors, make it a top-level node
          return {
            ...node,
            parentNode: undefined,
            extent: undefined,
            position: absPos
          };
        }
      }
      return node;
    });

  // Remove selected edges AND edges connected to nodes that were actually deleted
  const newNodeIds = new Set(newNodes.map(n => n.id));
  const newEdges = edges.filter(e => 
    !edgeIdsToDelete.has(e.id) && 
    newNodeIds.has(e.source) && 
    newNodeIds.has(e.target)
  );

  return { newNodes, newEdges };
}

export function lockNodes(nodes: Node[], selectedNodes: Node[]): Node[] {
  return nodes.map(node =>
    selectedNodes.some(sn => sn.id === node.id)
      ? { ...node, draggable: false, data: { ...node.data, locked: true } }
      : node
  );
}

export function unlockNodes(nodes: Node[], selectedNodes: Node[]): Node[] {
  return nodes.map(node =>
    selectedNodes.some(sn => sn.id === node.id)
      ? { ...node, draggable: true, data: { ...node.data, locked: false } }
      : node
  );
}
