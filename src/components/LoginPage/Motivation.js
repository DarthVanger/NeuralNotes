import React from 'react';
import styled from 'styled-components';
import { FONT_SIZE } from 'components/LoginPage/slideComponents';
import COLORS from 'components/LoginPage/colors';
import Avatar from '@material-ui/core/Avatar';
import SinglePlaceIcon from '@material-ui/icons/LocationSearching';
import StructureIcon from '@material-ui/icons/AccountTree';
import GoogleDriveIcon from '@material-ui/icons/CloudDone';
import SimpleFormatIcon from '@material-ui/icons/FormatAlignJustify';
import { makeStyles } from '@material-ui/core/styles';

const Article = styled.article`
  margin-bottom: 16vmin;
`;

const H2 = styled.h2`
  padding-bottom: 1rem;
  font-size: ${FONT_SIZE.H2};
  text-align: center;
  color: ${COLORS.white};
`;

const Ul = styled.ul`
  list-style-type: none;
  color: white;
  font-size: 3vmin;
`;
const Li = styled.li`
  margin: 0.5em;
  vertical-align: middle;
  display: flex;
  align-items: center;

  svg {
    font-size: 3vmin;
  }
`;

const useStyles = makeStyles(theme => ({
  bullet: {
    backgroundColor: 'white',
    marginRight: '2vmin',
    width: '6vmin',
    height: '6vmin',
  },
}));

const MotivationItem = ({ icon, children }) => {
  const classes = useStyles();

  return (
    <Li>
      <Avatar className={classes.bullet}>{icon}</Avatar>
      {children}
    </Li>
  );
};

const Motivation = () => {
  const classes = useStyles();

  return (
    <Article>
      <H2>Motivation</H2>
      <Ul>
        <MotivationItem icon={<SinglePlaceIcon />}>
          Single place for both notes and files
        </MotivationItem>
        <MotivationItem icon={<StructureIcon />}>
          Mind map encourages structure
        </MotivationItem>
        <MotivationItem icon={<GoogleDriveIcon />}>
          Google Drive provides robust storage
        </MotivationItem>
        <MotivationItem icon={<SimpleFormatIcon />}>
          Simple format: just folders and files
        </MotivationItem>
      </Ul>
    </Article>
  );
};

export default Motivation;
