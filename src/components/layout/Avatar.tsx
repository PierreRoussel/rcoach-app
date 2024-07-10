import './Avatar.scss';

export default function Avatar(params: {
  chain?: string;
  children?: any;
  couleur?: string;
}) {
  const initials =
    params.chain &&
    (params.chain.split(' ').length > 1
      ? params.chain.split(' ')[0][0] + params.chain.split(' ')[1][0]
      : params.chain.split(' ')[0][0]);

  return (
    <div className='avatar'>
      <span>{params.children || initials}</span>
      <div
        className='avatar-background'
        style={{
          ...(params.couleur && { background: params.couleur }),
        }}
      ></div>
    </div>
  );
}
