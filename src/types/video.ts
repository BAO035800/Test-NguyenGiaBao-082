/**
 * Shape of a single video item rendered in the feed.
 */
export interface Video {
  /** Stable unique identifier. */
  id: string;
  /** Direct URL to an MP4 video source. */
  videoUrl: string;
  /** Display name of the video author. */
  authorName: string;
  /** Short caption / description shown over the video. */
  description: string;
  /** Initial like count used to seed the like state. */
  likesCount: number;
}
