import Image from 'next/image'
import Avatar from './Avatar'

export default function Profile() {
  return (
    <div>
      <Avatar person="sss" size="123"/>
      <Image
        src="https://store.sdbao.com/sems/ins/postpaid/horn.png"
        width={44}
        height={44}
        alt="Katherine Johnson"
      />
    </div>
  );
}