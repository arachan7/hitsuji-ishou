export type CostumePhoto = {
  src: string;
  caption?: string;
};

// 衣装写真の一覧
// 追加方法: public/costumes/[サイズ]/ に画像ファイルを置いて、ここに src を追記する
export const COSTUME_DATA: Record<string, CostumePhoto[]> = {
  '50-60':   [],
  '70-80':   [],
  '80-90':   [],
  '90-100':  [],
  '100-110': [],
  '110-120': [],
  '120-130': [],
};
