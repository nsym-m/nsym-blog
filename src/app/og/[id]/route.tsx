import { ImageResponse } from '@vercel/og'
import { getArticle, getAllArticleIds } from '../../../lib/articles'
import { config } from '../../../config'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-static'

// OGP画像の標準サイズ
const OG_WIDTH = 1200
const OG_HEIGHT = 630

// フォントを読み込み
const fontPath = path.join(process.cwd(), 'public/fonts/NotoSansJP-Regular.ttf')
const fontData = fs.readFileSync(fontPath)

// アバター画像を読み込み
const avatarPath = path.join(process.cwd(), `public/images/${config.image.avatar}`)
const avatarData = fs.readFileSync(avatarPath)
const avatarBase64 = `data:image/jpeg;base64,${avatarData.toString('base64')}`

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<ImageResponse> {
  const { id } = await params
  const article = await getArticle(id)
  const title = article.header.matterData.title

  // タイトルの長さに応じてフォントサイズを調整
  const getFontSize = (length: number) => {
    if (length > 50) return 40
    if (length > 35) return 48
    return 56
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #b2f2bb 0%, #96f2d7 50%, #99e9f2 100%)',
          padding: '48px',
        }}
      >
        {/* 内側の白い背景 */}
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '50px 60px',
          }}
        >
          {/* タイトル */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
            }}
          >
            <h1
              style={{
                fontSize: getFontSize(title.length),
                fontWeight: 700,
                color: '#1a1a1a',
                lineHeight: 1.4,
                margin: 0,
                wordBreak: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </h1>
          </div>

          {/* フッター: サイト名 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              {/* サイトアイコン */}
              <img
                src={avatarBase64}
                width={48}
                height={48}
                style={{
                  borderRadius: '50%',
                }}
              />
              <span
                style={{
                  fontSize: '28px',
                  color: '#374151',
                  fontWeight: 500,
                }}
              >
                {config.siteTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        {
          name: 'NotoSansJP',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}

export function generateStaticParams(): { id: string }[] {
  return getAllArticleIds().map((article) => ({
    id: article.id,
  }))
}
