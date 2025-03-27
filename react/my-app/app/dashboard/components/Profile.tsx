import Image from 'next/image'
import Avatar from './Avatar'

export default function Profile() {
  return (
    <div>
      <Avatar person="sss" size="123"/>
      <Image
        src="https://gw.alicdn.com/bao/uploaded/i1/2207806982565/O1CN01zhc0gf1UoovIgIneq_!!2207806982565.jpg"
        width={44}
        height={44}
        alt="Katherine Johnson"
      />
    </div>
  );
}