import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const UsersList = ({ users }) => {
  return (
    <List>
      {users.map(user => (
        <ListItem key={user.id}>
          <ListItemText primary={user.name} secondary={user.email} />
        </ListItem>
      ))}
    </List>
  );
};

export default UsersList;
