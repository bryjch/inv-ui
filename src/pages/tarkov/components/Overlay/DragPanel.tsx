import { useRef } from 'react'
import Draggable from 'react-draggable'
import { IoCloseSharp } from 'react-icons/io5'

export type DragPanelProps = {
  title?: string
  backgroundColor?: string
  children?: React.ReactNode
} & typeof defaultProps

const defaultProps = {
  title: '',
  backgroundColor: 'rgba(15, 15, 15, 0.95)',
}

export const DragPanel = (props: DragPanelProps) => {
  const ref = useRef<HTMLDivElement | null>(null)

  return (
    <Draggable nodeRef={ref} handle=".drag-handle" defaultPosition={{ x: 0, y: 0 }} bounds="body">
      <div className="drag-panel" ref={ref}>
        <div className="drag-handle">
          {props.title && <div className="title">{props.title}</div>}

          <div className="flex-spacer" />

          <div className="close-btn">
            <IoCloseSharp color="#ffffff" />
          </div>
        </div>

        <div className="content">{props.children}</div>

        <style jsx>{`
          $drag-handle-height: 1.66rem;

          .drag-panel {
            position: absolute;
            display: flex;
            flex-flow: column nowrap;
            border: 1px solid rgba(150, 150, 150, 0.5);
            box-shadow: 0 0 6px #000000, 0 0 6px #000000, 0 0 6px #000000;
            z-index: 200;

            &:before {
              position: absolute;
              content: '';
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              pointer-events: none;
              backdrop-filter: blur(3px);
            }

            .drag-handle {
              position: relative;
              display: flex;
              flex-flow: row nowrap;
              flex-shrink: 0;
              width: 100%;
              height: $drag-handle-height;
              line-height: $drag-handle-height;
              background-color: rgba(35, 35, 35, 1);

              &:hover {
                background-color: rgba(45, 45, 45, 1);
              }

              .title {
                color: #ffffff;
                padding: 0 0.5rem;
                user-select: none;
              }

              .close-btn {
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #921e1e;
                width: $drag-handle-height;
                height: 100%;

                &:hover {
                  background-color: #cd1717;
                }
              }
            }

            .content {
              position: relative;
            }
          }
        `}</style>

        <style jsx>{`
          .drag-panel {
            background-color: ${props.backgroundColor};
          }
        `}</style>
      </div>
    </Draggable>
  )
}

DragPanel.defaultProps = defaultProps
