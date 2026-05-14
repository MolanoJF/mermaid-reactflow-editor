import * as htmlToImage from 'html-to-image';
import { Node, getRectOfNodes } from 'reactflow';

export async function exportReactFlowImage({
  wrapper,
  nodes,
  reactFlowInstance,
  setExporting,
  onError,
  fileName = 'reactflow-diagram.png',
  pixelRatio = 2,
}: {
  wrapper: HTMLElement;
  nodes: Node[];
  reactFlowInstance: any;
  setExporting: (v: boolean) => void;
  onError?: (err: any) => void;
  fileName?: string;
  pixelRatio?: number;
}) {
  setExporting(true);
  
  const originalViewport = reactFlowInstance.getViewport();
  // Target the actual React Flow container, avoiding our custom toolbars
  const flowContainer = (wrapper.querySelector('.react-flow') as HTMLElement) || wrapper;
  
  const originalWidth = flowContainer.style.width;
  const originalHeight = flowContainer.style.height;
  const originalPosition = flowContainer.style.position;
  
  let styleEl: HTMLStyleElement | null = null;
  
  try {
    const rfNodes = reactFlowInstance.getNodes();
    if (!rfNodes || rfNodes.length === 0) throw new Error('No nodes to export');
    
    // 1. Calculate exact bounds of all nodes
    const nodesBounds = getRectOfNodes(rfNodes);
    
    // 2. Add generous padding for edges and labels (increased to avoid clipping long edges)
    const padding = 150;
    nodesBounds.x -= padding;
    nodesBounds.y -= padding;
    nodesBounds.width += padding * 2;
    nodesBounds.height += padding * 2;
    
    const exportWidth = nodesBounds.width;
    const exportHeight = nodesBounds.height;
    
    // 3. Actually resize the container in the DOM so React Flow recalculates SVG bounds
    // We make it absolute so it doesn't break the flex layout while expanding
    flowContainer.style.position = 'absolute';
    flowContainer.style.width = `${exportWidth}px`;
    flowContainer.style.height = `${exportHeight}px`;
    
    // 4. Set viewport to align top-left of bounds to (0,0) with zoom 1
    reactFlowInstance.setViewport({ x: -nodesBounds.x, y: -nodesBounds.y, zoom: 1 });
    
    // Force edge labels to be visible just in case React Flow hides them to measure them during this viewport shift
    styleEl = document.createElement('style');
    styleEl.id = 'export-image-fix';
    styleEl.innerHTML = `
      .react-flow__edge-textwrapper { visibility: visible !important; }
      .react-flow__edge-text { visibility: visible !important; }
    `;
    flowContainer.appendChild(styleEl);
    
    // Wait for React Flow's ResizeObserver and React state to settle
    await new Promise(res => setTimeout(res, 500));
    
    // 5. Capture the .react-flow element
    const dataUrl = await htmlToImage.toPng(flowContainer, {
      pixelRatio,
      backgroundColor: '#fff',
      width: exportWidth,
      height: exportHeight,
      style: {
        width: `${exportWidth}px`,
        height: `${exportHeight}px`,
        transform: 'none',
      },
      // Force edge labels to be visible just in case React Flow is still measuring them
      filter: (node: any) => {
        // Exclude UI controls, handles, minimaps, and background grid
        if (node?.classList && typeof node.classList.contains === 'function') {
          if (
            node.classList.contains('react-flow__minimap') ||
            node.classList.contains('react-flow__controls') ||
            node.classList.contains('react-flow__background') ||
            node.classList.contains('react-flow__handle') ||
            node.classList.contains('react-flow__panel')
          ) {
            return false;
          }
        }
        return true;
      }
    });
    
    // 6. Download image
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
    
  } catch (err) {
    console.error('Export error:', err);
    if (onError) onError(err);
    else alert('Failed to export image: ' + err);
  } finally {
    // 7. Restore original styles and viewport
    flowContainer.style.width = originalWidth;
    flowContainer.style.height = originalHeight;
    flowContainer.style.position = originalPosition;
    
    // Give DOM a tick to restore bounds before restoring viewport
    await new Promise(res => setTimeout(res, 50));
    reactFlowInstance.setViewport(originalViewport);
    
    if (styleEl && styleEl.parentNode) {
      styleEl.parentNode.removeChild(styleEl);
    }
    
    setExporting(false);
  }
}

