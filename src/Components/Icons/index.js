import React from 'react';
import {Image} from 'react-native';
import share from '../../Assets/share.png';
import comment from '../../Assets/speech-bubble.png';
import like from '../../Assets/thumb-up.png';

export function Like(props) {
  return <Image source={like} {...props} />;
}

export function Comment(props) {
  return <Image source={comment} {...props} />;
}

export function Share(props) {
  return <Image source={share} {...props} />;
}
