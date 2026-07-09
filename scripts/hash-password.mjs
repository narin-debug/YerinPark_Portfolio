// 관리자 비밀번호 해시 생성 스크립트.
// 사용법: node scripts/hash-password.mjs "원하는 비밀번호"
// 출력된 값을 ADMIN_PASSWORD_HASH 환경변수에 넣는다 (평문 비밀번호는 어디에도 저장하지 않는다).
//
// bcrypt 해시에는 $ 문자가 들어가는데, Next.js가 .env 파일을 읽을 때 $이름
// 형태를 변수 치환으로 잘못 해석해 값이 깨지는 문제가 있다. 그래서 해시를
// base64로 한 번 감싸서 저장한다 (lib/auth.ts에서 다시 풀어서 비교함).
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('사용법: node scripts/hash-password.mjs "원하는 비밀번호"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log(Buffer.from(hash, "utf8").toString("base64"));
