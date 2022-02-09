import React from 'react';
import styled from 'styled-components';
import MailIcon from '@material-ui/icons/MailOutline';
import GitHubIcon from '@material-ui/icons/GitHub';
import discordLogo from 'components/LoginPage/images/discord-logo.svg';
import TelegramIcon from '@material-ui/icons/Telegram';
import Icon from '@material-ui/core/Icon';

const ContactIcons = () => {
  const Container = styled.div`
    a,
    a:hover,
    a:active,
    a:link,
    a:visited {
      color: #9da0f5;
      text-decoration: none;

      &:not(:first-child) {
        margin-left: 1em;
      }
    }

    img {
      height: 1.3rem;
    }
  `;

  return (
    <Container>
      <a
        href="mailto:feedback@neural-notes.com"
        target="_blank"
        rel="noreferrer">
        <MailIcon />
      </a>
      <a href="https://t.me/neuralnotes" target="_blank" rel="noreferrer">
        <TelegramIcon />
      </a>
      <a href="https://discord.gg/epQc9Tkg3K" target="_blank" rel="noreferrer">
        <Icon>
          <img src={discordLogo} />
        </Icon>
      </a>
      <a
        href="https://github.com/DarthVanger/NeuralNotes"
        target="_blank"
        rel="noreferrer">
        <GitHubIcon />
      </a>
    </Container>
  );
};

export default ContactIcons;
