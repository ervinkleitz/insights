import React from 'react';
import { ITableState } from './Table';

/** TYPE DEFINITIONS **/
interface IProps {
  back: () => void;
  reset: () => void;
  history: ITableState[];
}

type IState = any;
/** TYPE DEFINITIONS **/

class Prompt extends React.Component<IProps, IState>{
  render() {
    return (
      <div>
        {!!this.props.history.length &&
          <div style={{ padding: '1em 0' }}>
            <button onClick={this.props.back} className='md'>GO BACK</button>
            <button onClick={this.props.reset} className='md'>CLEAR HISTORY</button><br />
          </div>
        }
      </div >
    );
  }
}

export default Prompt;