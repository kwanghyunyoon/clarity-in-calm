/**
 * Writes a JSON string to a cache file and hands it off through the share
 * sheet, matching the flow every export/backup action in this app uses.
 * Callers own the filename, the share-sheet's dialog title, and — for
 * platforms with no share sheet — a fallback UI showing `uri` to the user,
 * since a silently unreachable cache file is a real loss of the created data.
 */
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function shareJsonFile(
  json: string,
  filename: string,
  dialogTitle: string,
): Promise<{ shared: boolean; uri: string }> {
  const file = new File(new Directory(Paths.cache), filename);
  file.write(json);
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle });
  }
  return { shared: canShare, uri: file.uri };
}
