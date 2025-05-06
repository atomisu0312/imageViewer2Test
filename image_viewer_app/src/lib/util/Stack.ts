/**
 * スタックデータ構造を実装したクラス
 * LIFO（Last In First Out）の原則に従う
 */
export class Stack<T> {
  private data: T[];

  constructor() {
    this.data = [];
  }

  /**
   * スタックの先頭に要素を追加
   * @param record 追加する要素
   */
  push(record: T) {
    this.data.push(record);
  }

  /**
   * スタックの先頭から要素を取り出して削除
   * @returns 取り出した要素、スタックが空の場合はundefined
   */
  pop(): T | undefined {
    return this.data.pop();
  }

  /**
   * スタックの先頭の要素を参照（削除はしない）
   * @returns 先頭の要素、スタックが空の場合はundefined
   */
  peek(): T | undefined {
    return this.data[this.data.length - 1];
  }

  /**
   * スタックを空にする
   */
  clear() {
    this.data = [];
  }

  /**
   * スタックの現在の要素数を取得
   */
  get length(): number {
    return this.data.length;
  }
} 