import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ModelErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error loading 3D model:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Return a generic invisible group or a subtle 3D text fallback 
      // instead of crashing the whole Canvas
      return (
        <group>
          <mesh>
             <boxGeometry args={[0, 0, 0]} />
             <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </group>
      );
    }

    return this.props.children;
  }
}

export default ModelErrorBoundary;
