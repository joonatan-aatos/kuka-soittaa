import Debug from 'debug';

export const debug = Debug('kuka-soittaa');
const appDebug = debug.extend('app');

Debug.enable('kuka-soittaa:*');

export default appDebug;
