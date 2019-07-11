import React from 'react';
import Modal from 'react-responsive-modal';

/** TYPE DEFINITIONS **/
interface IProps {
  handlers: {
    setFilter: (filterUsing: string, ipAddress?: string) => undefined,
    openModal: (shouldOpen: boolean) => undefined;
  };
  promptProps: {
    isOpen: boolean;
    ipAddress: string;
  };
}

interface IState {
  open: boolean;
}
/** TYPE DEFINITIONS **/

class Prompt extends React.Component<IProps, IState>{

  constructor(props: IProps) {
    super(props);
    this.state = {
      open: this.props.promptProps.isOpen
    } as IState;
  }

  render() {
    return (
      <div>
        <Modal
          open={this.props.promptProps.isOpen}
          onClose={() => this.props.handlers.openModal(false)}
          center>
          <h4>Select the column to Filter / Pivot {this.props.promptProps.ipAddress}:</h4>
          <div className='center'>
            <button
              onClick={() => this.props.handlers.setFilter('destination')}>
              DESTINATION
            </button>
            <button
              onClick={() => this.props.handlers.setFilter('source')}>
              SOURCE
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Prompt;