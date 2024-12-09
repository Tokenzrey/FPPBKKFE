export interface Blog {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  judul: string;
  content: string;
  thumbnail: string;
  like_count: number;
  comment_count: number;
  user_id: number;
  User: {
    ID: number;
    name: string;
    email: string;
    tanggal_lahir: string;
    biografi: string;
  };
}
