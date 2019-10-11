import styled, {injectGlobal} from 'styled-components'

injectGlobal`
  .react_dragClass {
    // transform: rotate(1deg);
  }
  
  .react_dragLaneClass {
    // transform: rotate(1deg);
  }
`;

export const BoardDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100vh;
  padding: 10px;
  background-color: #7147C2;
  font-family: 'Roboto', sans-serif;
  color: #393939;
  overflow-y: hidden;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 10px;
`;

export const LaneHeader = styled(Header)`
	margin-bottom: 0px;
	padding: 0px 5px;
`;

export const Section = styled.section`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  margin: 5px 10px;
  padding: 10px;
  height: auto;
  background-color: #e3e3e3;
  border-radius: 3px;
`;

export const Title = styled.span`
  font-weight: bold;
  font-size: 18px;
  line-height: 18px;
  cursor: grab;
  max-width: 250px;
  min-width: 230px;
`;

export const CardWrapper = styled.article`
  position: relative;
  margin-bottom: 8px;
  padding: 10px;
  max-width: 250px;
  min-width: 230px;
  background-color: #fff;
  border-bottom: 3px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
`;

export const MovableCardWrapper = styled(CardWrapper)`
  &:hover {
    background-color: #f0f0f0;
`;

export const ScrollableLane = styled.div`
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
	align-self: center;
	margin-top: 12px;
	min-width: 250px;
	max-height: 90vh;
	overflow-y: ${props => (props.handleCardClick ? 'hidden' : 'none')};
	overflow-x: hidden;
`;

export const CardHeader = styled(Header)`
  padding-bottom: 6px;
  border-bottom: 1px solid #eee;
`;

export const CardTitle = styled(Title)`
  font-size: 15px;
`;

export const Detail = styled.div`
  font-size: 14px;
  color: #4d4d4d;
  white-space: normal;
`;

